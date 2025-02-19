import toast from "react-hot-toast";
const notify = (message, type) =>
  toast[type](message, {
    duration: 4000,
    position: "top-center",
  });

export default notify;
