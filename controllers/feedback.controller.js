import Feedback from "../models/feedback.js";



// User creates feedback
export const createFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.create({
      userId: req.user.userId,
      message: req.body.message
    });

    res.status(201).json({ message: "Feedback created", feedback });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User get only their own feedbacks
export const getMyFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({
      userId: req.user.userId
    }).sort({ createdAt: -1 });

    res.json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin view all feedbacks
export const getAllFeedback = async (req, res) => {
  const feedbacks = await Feedback.find().populate("userId", "name email");
  res.json(feedbacks);
};

// User update own feedback OR admin update
export const updateFeedback = async (req, res) => {
  const feedback = await Feedback.findById(req.params.id);

  if (!feedback) return res.status(404).json({ message: "Not found" });

  if (
    feedback.userId.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({ message: "Not authorized" });
  }

  feedback.message = req.body.message;
  await feedback.save();

  res.json({ message: "Feedback updated", feedback });
};

// Admin delete feedback
export const deleteFeedback = async (req, res) => {
  await Feedback.findByIdAndDelete(req.params.id);
  res.json({ message: "Feedback deleted" });
};
