const Client = require("../model/clients");

exports.addClient = async (req, res) => {
  try {
    const { clientName, clientphoneNumber, email, gstNo, joiningdate, address,amount } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: "Client name is required" });
    }

    const newClient = new Client({
      clientName,
      clientphoneNumber,
      email,
      gstNo,
      joiningdate,
      address,
      amount
    });

    const savedClient = await newClient.save();

    res.status(200).json({
      message: "Client added successfully",
      data: savedClient,
    });
  } catch (error) {
    console.error("Error adding client:", error);
    res.status(500).json({
      message: "Internal server error while adding client",
      error: error.message,
    });
  }
};

exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.status(200).json({ message: "Clients fetched successfully", data: clients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching clients", error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { clientName, clientphoneNumber, email, gstNo, joiningdate, address,amount } = req.body;

    if (!clientName) {
      return res.status(400).json({ message: "Client name is required" });
    }

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      { clientName, clientphoneNumber, email, gstNo, joiningdate, address,amount },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json({
      message: "Client updated successfully",
      data: updatedClient,
    });
  } catch (error) {
    console.error("Error updating client:", error);
    res.status(500).json({
      message: "Internal server error while updating client",
      error: error.message,
    });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Client.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Client not found" });

    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting client", error: error.message });
  }
};

exports.toggleActiveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await Client.findById(id);
    if (!client)
      return res.status(404).json({ message: "Client not found" });

    client.isActive = !client.isActive;
    await client.save();

    res.status(200).json({
      message: `Client status updated to ${client.isActive ? "Active" : "Inactive"}`,
      data: client,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating status", error: error.message });
  }
};
