import { NavLink } from "react-router-dom";
import { deleteToken, getToken } from "../utility/tokenHelper";
import { updateUserLastSeen } from "../api/apiRequest";

const Navbar = () => {
	const token = getToken();
	return (
		<nav className="navbar navbar-expand-lg bg-body-tertiary mb-5">
			<div className="container">
				<NavLink to={"/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
					User Management
				</NavLink>
				<button
					className="navbar-toggler"
					type="button"
					data-bs-toggle="collapse"
					data-bs-target="#navbarSupportedContent"
					aria-controls="navbarSupportedContent"
					aria-expanded="false"
					aria-label="Toggle navigation"
				>
					<span className="navbar-toggler-icon"></span>
				</button>
				<div className="collapse navbar-collapse" id="navbarSupportedContent">
					<ul className="navbar-nav mx-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink to={"/"} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
								Home
							</NavLink>
						</li>
						<li className="nav-item">
							{token ? (
								<NavLink
									to={"/signin"}
									className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
									onClick={async () => {
										await updateUserLastSeen(new Date());
										deleteToken();
									}}
								>
									Sign Out
								</NavLink>
							) : (
								<NavLink
									to={"/signin"}
									className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}
								>
									Signin
								</NavLink>
							)}
						</li>
					</ul>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
