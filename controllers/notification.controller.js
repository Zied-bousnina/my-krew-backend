const notificationModel = require("../models/notificationModel");



const fetchNotificationsByCurrentUser = async (req, res) => {
    const userId = req.user.id; // Assuming the user ID is available here
    const { limit } = req.query; // Expecting a query parameter 'limit' to optionally limit the results

    try {
        let query = notificationModel.find({ userId }).sort({ createdAt: -1 }); // Sort by createdAt in descending order

        // Check if a limit is specified and it's set to fetch only 5 records
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


const deleteNotificationById = async (req, res) => {
    const { notificationId } = req.params; // Assuming the ID is passed as a URL parameter

    try {
        const result = await notificationModel.findByIdAndDelete(notificationId);

        if (!result) {
            return res.status(404).json({ message: "Notification non trouvée" });
        }

        res.status(200).json({ message: "Notification supprimée avec succès" });
    } catch (error) {
        console.error("Erreur lors de la suppression de la notification :", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


module.exports = {
    fetchNotificationsByCurrentUser,
    deleteNotificationById
  };

