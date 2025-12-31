const Product = require("../model/product");

exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      brandName,
      deviceType,
      processor,
      generation,
      systems = [],
      description,
    } = req.body;

    if (!productName || !brandName || !deviceType || !processor || !generation) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const quantity = systems.length;
    const availableQty = systems.filter(s => s.isAvailable).length;

    const product = await Product.create({
      productName,
      brandName,
      deviceType,
      processor,
      generation,
      systems,
      quantity,
      availableQty,
      description,
    });

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      data: product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const {
      productName,
      brandName,
      deviceType,
      processor,
      generation,
      systems = [],
      description,
    } = req.body;

    const quantity = systems.length;
    const availableQty = systems.filter(s => s.isAvailable).length;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        productName,
        brandName,
        deviceType,
        processor,
        generation,
        systems,
        quantity,
        availableQty,
        description,
      },
      { new: true }
    );

    res.json({ message: "Product updated", data: updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  const products = await Product.find()
    .populate("deviceType")
    .populate("processor")
    .populate("generation")
    .sort({ createdAt: -1 });

  res.json({ data: products });
};

exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate("deviceType")
    .populate("processor")
    .populate("generation");

  res.json({ data: product });
};


exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
