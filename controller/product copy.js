const Product = require("../model/product");


exports.addProduct = async (req, res) => {
  try {
    const {
      productName,
      productType,
      brandName,
      deviceType,
      processor,
      generation,
      quantity,
      availableQty,
      systemNumber,
      serialNumber,
      description,
    } = req.body;

    if (!productName || !productType || !brandName || !quantity) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newProduct = new Product({
      productName,
      productType,
      brandName,
      deviceType,
      processor,
      generation,
      quantity,
      availableQty,
      systemNumber,
      serialNumber,
      description,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ message: "Product added successfully", data: savedProduct });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "All products fetched", data: products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product fetched successfully", data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product", error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully", data: updatedProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};
