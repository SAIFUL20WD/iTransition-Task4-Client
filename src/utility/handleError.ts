import { AxiosError } from "axios";
import toast from "react-hot-toast";

const handleError = (error: unknown) => {
	if (error instanceof AxiosError) {
		const errorMessage = error?.response?.data?.message || "Something went wrong!";
		toast.error(errorMessage);
	} else {
		toast.error("An unknown error occurred");
	}
};

export default handleError;
