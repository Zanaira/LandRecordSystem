import Swal from "sweetalert2";
export default function showToast (message, type) {
    Swal.fire({
      icon: type, // "success", "error", "warning", "info", "question"
      title: message,
      toast: true,
      position: "bottom-end",
      timer: 3500,
      timerProgressBar: true,
      showConfirmButton: false,
      background: "#f4f6f9", 
      color: type === "error" ? "#b91c1c" : "#1f2937", 
      customClass: {
        popup: "border border-gray-300 shadow-lg rounded-lg",
        title: "text-lg font-semibold tracking-wide",
      },
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      }
    });
  };