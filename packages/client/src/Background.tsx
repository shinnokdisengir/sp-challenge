import React from 'react'
import styled from 'styled-components'
const Background = ({ className }) => {
    return (
        <ul className={className}>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
        </ul>
    )
}

const StyledBackground = styled(Background)`
    body {
        padding: 0;
        margin: 0;
        background: #03a9f4;
    }

    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;

    & > li {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        transform-origin: 0 0;
    }

    & > li:nth-child(odd) {
        background-image: linear-gradient(
            -197deg,
            rgba(255, 255, 255, 0.4) 5%,
            transparent 25%
        );
    }

    & > li:nth-child(1) {
        transform: rotate(18deg) skewX(72deg);
    }
    & > li:nth-child(2) {
        transform: rotate(36deg) skewX(72deg);
    }
    & > li:nth-child(3) {
        transform: rotate(54deg) skewX(72deg);
    }
    & > li:nth-child(4) {
        transform: rotate(72deg) skewX(72deg);
    }
    & > li:nth-child(5) {
        transform: rotate(90deg) skewX(72deg);
    }
    & > li:nth-child(6) {
        transform: rotate(108deg) skewX(72deg);
    }
    & > li:nth-child(7) {
        transform: rotate(126deg) skewX(72deg);
    }
    & > li:nth-child(8) {
        transform: rotate(144deg) skewX(72deg);
    }
    & > li:nth-child(9) {
        transform: rotate(162deg) skewX(72deg);
    }
    & > li:nth-child(10) {
        transform: rotate(180deg) skewX(72deg);
    }
    & > li:nth-child(11) {
        transform: rotate(198deg) skewX(72deg);
    }
    & > li:nth-child(12) {
        transform: rotate(216deg) skewX(72deg);
    }
    & > li:nth-child(13) {
        transform: rotate(234deg) skewX(72deg);
    }
    & > li:nth-child(14) {
        transform: rotate(252deg) skewX(72deg);
    }
    & > li:nth-child(15) {
        transform: rotate(270deg) skewX(72deg);
    }
    & > li:nth-child(16) {
        transform: rotate(288deg) skewX(72deg);
    }
    & > li:nth-child(17) {
        transform: rotate(306deg) skewX(72deg);
    }
    & > li:nth-child(18) {
        transform: rotate(324deg) skewX(72deg);
    }
    & > li:nth-child(19) {
        transform: rotate(342deg) skewX(72deg);
    }
    & > li:nth-child(20) {
        transform: rotate(360deg) skewX(72deg);
    }
`
export default StyledBackground
