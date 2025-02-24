const Template = require("../models/Template");

exports.saveTemplate = async (req, res) => {
    try {
      const { name, content, variables } = req.body;
      const template = new Template({ userId: req.userId, name, content, variables });
      await template.save();
      res.status(201).json(template);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getTemplates = async (req, res) => {
    try {
      const templates = await Template.find({ userId: req.userId });
      res.json(templates);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.updateTemplate = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, content, variables } = req.body;
      const template = await Template.findByIdAndUpdate(
        id,
        { name, content, variables },
        { new: true }
      );
      res.json(template);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.deleteTemplate = async (req, res) => {
    try {
      const { id } = req.params;
      await Template.findByIdAndDelete(id);
      res.json({ message: "Template deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };