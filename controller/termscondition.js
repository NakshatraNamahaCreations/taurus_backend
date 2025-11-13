const Terms = require('../model/termscondition');

exports.createTerms = async (req, res) => {
    try {
        const { clientId, clientName, title, points } = req.body;
        const newTerms = new Terms({ clientId, clientName, title, points });
        await newTerms.save();
        res.status(201).json(newTerms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTerms = async (req, res) => {
    try {
        const terms = await Terms.find();
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTermsById = async (req, res) => {
    try {
        const terms = await Terms.findById(req.params.id);
        if (!terms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTerms = async (req, res) => {
    try {
        const { clientId, clientName, title, points } = req.body;
        const updatedTerms = await Terms.findByIdAndUpdate(
            req.params.id,
            { clientId, clientName, title, points },
            { new: true }
        );
        if (!updatedTerms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json(updatedTerms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTerms = async (req, res) => {
    try {
        const deletedTerms = await Terms.findByIdAndDelete(req.params.id);
        if (!deletedTerms) return res.status(404).json({ message: 'Terms not found' });
        res.status(200).json({ message: 'Terms deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTermsByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;
        const terms = await Terms.find({ clientId });
        if (!terms || terms.length === 0) 
            return res.status(404).json({ message: 'No terms found for this client' });
        res.status(200).json(terms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};