import { useEffect, useRef, useState } from "react";
import { TUser } from "../types/User";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import ReactTimeAgo from "react-time-ago";
import "react-tooltip/dist/react-tooltip.css";
import moment from "moment";
import { Tooltip } from "react-tooltip";

type TUserTableProps = {
	data: { data: { data: TUser[] } } | undefined;
	isLoading: boolean;
	isSuccess: boolean;
	selectedUsers: number[];
	setSelectedUsers: React.Dispatch<React.SetStateAction<number[]>>;
};

const UserTable = ({ data, isLoading, isSuccess, selectedUsers, setSelectedUsers }: TUserTableProps) => {
	const [sortColumn, setSortColumn] = useState<"name" | "email" | "lastSeen">("name");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

	const headerCheckboxRef = useRef<HTMLInputElement>(null);

	const handleCheckboxChange = (userId: number, isChecked: boolean) => {
		setSelectedUsers((prevSelected) =>
			isChecked ? [...prevSelected, userId] : prevSelected.filter((id) => id !== userId)
		);
	};

	const handleSelectAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setSelectedUsers(isChecked ? data?.data?.data?.map((user: TUser) => user.id) || [] : []);
	};

	const sortData = (users: TUser[]) => {
		return [...users].sort((a, b) => {
			if (a[sortColumn] < b[sortColumn]) {
				return sortDirection === "asc" ? -1 : 1;
			}
			if (a[sortColumn] > b[sortColumn]) {
				return sortDirection === "asc" ? 1 : -1;
			}
			return 0;
		});
	};

	const handleSort = (column: "name" | "email" | "lastSeen") => {
		if (column === sortColumn) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	useEffect(() => {
		if (headerCheckboxRef.current) {
			const totalUsers = data?.data?.data?.length || 0;
			const selectedCount = selectedUsers.length;

			headerCheckboxRef.current.indeterminate = selectedCount > 0 && selectedCount < totalUsers;
			if (selectedCount === totalUsers) {
				headerCheckboxRef.current.checked = true;
			} else {
				headerCheckboxRef.current.checked = false;
			}
		}
	}, [selectedUsers, data?.data?.data?.length]);

	if (isLoading) {
		return (
			<div className="container d-flex justify-content-center mt-5">
				<div className="spinner-border text-primary" role="status">
					<span className="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	if (isSuccess) {
		const sortedUsers = data?.data?.data ? sortData(data.data.data) : [];
		return (
			<table className="container table table-hover">
				<thead>
					<tr>
						<th scope="col">
							<input
								ref={headerCheckboxRef}
								className="form-check-input"
								type="checkbox"
								onChange={handleSelectAllChange}
							/>
						</th>
						<th scope="col" role="button" onClick={() => handleSort("name")}>
							Name {sortColumn === "name" && (sortDirection === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
						</th>
						<th scope="col" role="button" onClick={() => handleSort("email")}>
							Email{" "}
							{sortColumn === "email" && (sortDirection === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
						</th>
						<th scope="col" role="button" onClick={() => handleSort("lastSeen")}>
							Last Seen{" "}
							{sortColumn === "lastSeen" && (sortDirection === "asc" ? <FaArrowUp /> : <FaArrowDown />)}
						</th>
					</tr>
				</thead>
				<tbody>
					{sortedUsers?.map((user: TUser) => {
						return (
							<tr key={user?.id}>
								<th scope="row">
									<input
										className="form-check-input"
										type="checkbox"
										checked={selectedUsers.includes(user.id)}
										onChange={(e) => handleCheckboxChange(user.id, e.target.checked)}
									/>
								</th>
								<td>
									<span
										className={`fw-normal ${
											user?.status === "blocked"
												? "text-decoration-line-through text-secondary"
												: ""
										}`}
									>
										{user?.name}
									</span>
									<span
										className={`d-block fw-light ${
											user?.status === "blocked" ? "text-secondary" : ""
										}`}
									>
										{user?.company ? user?.company : "N/A"}
									</span>
								</td>
								<td className={`${user?.status === "blocked" ? "text-secondary" : ""}`}>
									{user?.email}
								</td>
								<td>
									<ReactTimeAgo
										role="button"
										date={Date.parse(user?.lastSeen)}
										locale="en-US"
										tooltip={false}
										data-tooltip-id="last-seen-tooltip"
										data-tooltip-content={moment(user?.lastSeen).format("MMMM DD, YY HH:mm:ss")}
										data-tooltip-place="bottom"
									/>
									<Tooltip id="last-seen-tooltip" style={{ borderRadius: "8px" }}></Tooltip>
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	}
};

export default UserTable;
