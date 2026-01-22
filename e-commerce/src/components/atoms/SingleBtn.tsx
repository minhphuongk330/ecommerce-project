"use client";
import React from "react";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Icon from "./Icon";
import { SingleBtnProps } from "~/types/component";

const ARROW_ICONS = {
	left: KeyboardArrowLeft,
	right: KeyboardArrowRight,
};

const SingleBtn: React.FC<SingleBtnProps> = ({ direction, onClick }) => {
	const ArrowIcon = ARROW_ICONS[direction];
	return <Icon onClick={onClick} icon={<ArrowIcon className="!text-3xl" />} />;
};

export default SingleBtn;
