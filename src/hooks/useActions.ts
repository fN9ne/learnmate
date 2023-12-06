import { bindActionCreators } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

import ActionCreators from "../store/reducers/ActionCreators";

export const useActions = () => bindActionCreators(ActionCreators, useDispatch());
