import { FaLock, FaLockOpen, FaTrashAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUsers, updateUserStatus } from "../api/apiRequest";
import { AxiosResponse } from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type TToolbarProps = {
	selectedUsers: number[];
	setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};

type UpdateStatusVariables = {
	selectedUsers: number[];
	status: string;
};

const Toolbar = ({ selectedUsers, setSelectedUsers }: TToolbarProps) => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const userStatusMutation = useMutation<AxiosResponse, Error, UpdateStatusVariables>({
		mutationFn: ({ selectedUsers, status }) => updateUserStatus(selectedUsers, status),
		onSuccess: (data) => {
			setSelectedUsers([]);
			toast.success(data?.data?.message);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message);
			navigate("/signin");
		},
	});
	const deleteUserMutation = useMutation<AxiosResponse, Error, number[]>({
		mutationFn: (userIds) => deleteUsers(userIds),
		onSuccess: (data) => {
			setSelectedUsers([]);
			toast.success(data?.data?.message);
			queryClient.invalidateQueries({ queryKey: ["users"] });
		},
		onError: (error) => {
			toast.error(error?.response?.data?.message);
			navigate("/signin");
		},
	});

	return (
		<div className="container bg-body-tertiary d-flex justify-content-between align-items-center px-3 py-2">
			<div className="d-flex justify-content-between align-items-center">
				<button
					type="button"
					className="d-flex justify-content-between align-items-center btn btn-outline-primary me-1"
					onClick={() => {
						if (selectedUsers.length === 0) {
							toast.error("No user is selected");
						} else {
							userStatusMutation.mutate({ selectedUsers, status: "block" });
						}
					}}
				>
					<FaLock />
					<span className="fw-semibold ms-2">Block</span>
				</button>
				<button
					type="button"
					className="btn btn-outline-primary me-1"
					onClick={() => {
						if (selectedUsers.length === 0) {
							toast.error("No user is selected");
						} else {
							userStatusMutation.mutate({ selectedUsers, status: "unblock" });
						}
					}}
				>
					<FaLockOpen />
				</button>
				<button
					type="button"
					className="btn btn-outline-danger"
					onClick={() => {
						if (selectedUsers.length === 0) {
							toast.error("No user is selected");
						} else {
							deleteUserMutation.mutate(selectedUsers);
						}
					}}
				>
					<FaTrashAlt />
				</button>
			</div>
			<div>
				<input className="form-control" placeholder="Filter"></input>
			</div>
		</div>
	);
};

export default Toolbar;
