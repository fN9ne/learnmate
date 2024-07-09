import actionCreators from "../redux/actionCreators";

import { useDispatch } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";

export const useActions = () => {
	return bindActionCreators(actionCreators, useDispatch());
};
