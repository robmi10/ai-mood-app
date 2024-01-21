import React from "react";
import styled, { keyframes } from "styled-components";
export const BouncerLoaderWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 50px;
  height: 30px;
`;

const bounceranimation = keyframes`
 from{transform: translateY(0)}
 to{transform: translateY(-25px)}
 `;

export const BouncerDiv = styled.div`
  width: 10px;
  height: 10px;
  background-color: #e6f5fa;
  background-color: #f2f8fa;
  background-color: #fcfcfc;

  border-radius: 50%;
  animation: ${bounceranimation} 0.5s cubic-bezier(0.19, 0.57, 0.3, 0.98)
    infinite alternate;

  &:nth-child(2) {
    animation-delay: 0.1s;
    opacity: 0.8;
  }
  &:nth-child(3) {
    animation-delay: 0.2s;
    opacity: 0.6;
  }
  &:nth-child(4) {
    animation-delay: 0.3s;
    opacity: 0.4;
  }
`;

export const BouncerLoader = () => {
  return (
    <BouncerLoaderWrapper>
      <BouncerDiv />
      <BouncerDiv />
      <BouncerDiv />
      <BouncerDiv />
    </BouncerLoaderWrapper>
  );
};
