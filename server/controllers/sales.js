import OverallStat from "../models/OverallStat.js";

export const getSales = async (req, res) => {
    try{
        const overallStat = await OverallStat.find();

        res.status(200).json(overallStat[0]);
    } catch(error) {
        res.status(404).json({message: error.message})
    }
}
// Backend Route
export const getDailySales = async (req, res) => {
    try {
        // Fetch overall stats (adjust field names according to your model)
        const overallStat = await OverallStat.find();

        // Assuming the model has `dailySalesData` field that contains daily sales data
        const dailySalesData = overallStat[0].dailySalesData; // Access the daily sales data

        if (dailySalesData) {
            res.status(200).json(dailySalesData); // Send back daily sales data
        } else {
            res.status(404).json({ message: "No daily sales data found" });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};