import React from 'react';
import styled from 'styled-components/macro';
import  theme  from '../../styles/theme';
import mixins from '../../styles/mixins';
import Main from '../../styles/Main';

const { colors, fontSizes } = theme;

// TODO: Add the production link
const LOGIN_URL = process.env.NODE_ENV !== 'production' ? 'http://localhost:8080/login' : ''

const Login = styled(Main)`
    ${mixins.flexCenter};
    flex-direction: column;
    min-heightL 100vh;
    h1{
        font-size: ${fontSizes.xxl};
    }`;


const LoginButton = styled.a`
    display: inline-block;
    background-color: ${colors.green};
    color: ${colors.white};
    border-radius: 30px;
    padding: 17px 35px;
    margin: 20px 0 70px;
    min-width: 160px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
    &:hover, &:focus {
        background-color: ${colors.offGreen};
    }
`;

const LoginPage = () => (
    <Login>
        <h1>Spotify Overview</h1>
        <LoginButton href={LOGIN_URL} >Log In to Spotify</LoginButton>
    </Login>
);

export default LoginPage;