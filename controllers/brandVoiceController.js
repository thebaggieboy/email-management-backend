exports.saveBrandVoice = async (req, res) => {
    try {
      const { tone, commonPhrases } = req.body;
      const brandVoice = new BrandVoice({ userId: req.userId, tone, commonPhrases });
      await brandVoice.save();
      res.status(201).json(brandVoice);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  };
  
  exports.getBrandVoice = async (req, res) => {
    try {
      const brandVoice = await BrandVoice.findOne({ userId: req.userId });
      res.json(brandVoice);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };