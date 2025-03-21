import { Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { verifyToken } from "../utility/verifyToken";
import { getToken } from "../utility/tokenHelper";

type TProtectedRouteProps = {
	children: ReactNode;
};

const ProtectedRoute = ({ children }: TProtectedRouteProps) => {
	const token = getToken();
	if (!token) {
		return <Navigate to="/signin" replace={true} />;
	}

	const user = verifyToken(token);
	console.log(user);
	if (user) {
		return children;
	}

	return <Navigate to="/signin" replace={true} />;
};

export default ProtectedRoute;
