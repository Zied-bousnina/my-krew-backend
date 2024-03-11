const LogModel = require("../models/Log.model.js");


const fetchDataByUserId = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is available here
    const { limit } = req.query; // Expecting a query parameter 'limit' to optionally limit the results

    try {
        // Initialize the query with a filter for userId and sort it by createdAt in descending order
        let query = LogModel.find({ userId }).sort({ createdAt: -1 });

        // Check if a limit is specified and apply it
        if (limit === '5') {
            query = query.limit(5);
        }

        const results = await query.exec(); // Execute the query

        if (results.length === 0) {
            return res.status(404).json({ message: "Aucun enregistrement trouvé" });
        }

        res.status(200).json({
            status: 'success',
            count: results.length,
            data: results
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};



module.exports = {
    fetchDataByUserId
  };

