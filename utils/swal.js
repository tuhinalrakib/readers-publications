import Swal from "sweetalert2";

/**
 * Show a success SweetAlert2 popup
 */
export const showSuccessAlert = (title, text = "") => {
  return Swal.fire({
    icon: "success",
    title: title,
    text: text,
    confirmButtonColor: "#9333ea",
    background: "#0f172a",
    color: "#ffffff",
  });
};

/**
 * Show an error SweetAlert2 popup
 */
export const showErrorAlert = (title, text = "") => {
  return Swal.fire({
    icon: "error",
    title: title,
    text: text,
    confirmButtonColor: "#9333ea",
    background: "#0f172a",
    color: "#ffffff",
  });
};

/**
 * Show a confirmation dialog popup
 * @returns {Promise<boolean>} True if confirmed, false otherwise
 */
export const showConfirmDialog = async (
  title = "Are you sure?",
  text = "You won't be able to revert this!"
) => {
  const result = await Swal.fire({
    title: title,
    text: text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#334155",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
    background: "#0f172a",
    color: "#ffffff",
  });
  return result.isConfirmed;
};

export default Swal;
