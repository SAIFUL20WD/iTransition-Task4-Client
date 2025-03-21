import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../api/apiRequest";
import Navbar from "../components/Navbar";
import Toolbar from "../components/Toolbar";
import UserTable from "../components/UserTable";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
	const { data, isLoading, isSuccess, isError, error } = useQuery({
		queryKey: ["users"],
		queryFn: getAllUsers,
		refetchInterval: false,
	});
	const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
	const navigate = useNavigate();
	if (isError) {
		toast.error(error?.response?.data?.message);
		const status = error?.response?.status;
		if (status === 403 || status === 400) {
			navigate("/signin");
		}
	}
	// 	const selectedUserData = data?.data?.data?.filter((user: TUser) => selectedUsers.includes(user.id));
	return (
		<>
			<Toaster />
			<Navbar />
			<Toolbar selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
			<UserTable
				data={data}
				isLoading={isLoading}
				isSuccess={isSuccess}
				selectedUsers={selectedUsers}
				setSelectedUsers={setSelectedUsers}
			/>
		</>
	);
};

export default DashboardPage;
