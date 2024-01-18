import { gql } from "@apollo/client";

export const SIGN_UP_MUTATION = gql`
  mutation SignUp($username: String!, $name: String!, $password: String!, $email: String!) {
    signup(username: $username, name: $name, password: $password, email: $email) {
      user {
        username
        email
      }
    }
  }
`;

export const USER_CONFIRMATION_MUTATION = gql`
  mutation UserConfirmation($username: String!, $otp: String!) {
    confirmUser(username: $username, otp: $otp) {
      success
    }
  }
`;

export const SIGNIN_MUTATION = gql`
  mutation Signin($username: String!, $password: String!) {
    signin(username: $username, password: $password) {
      accessToken
      refreshToken
      userId
      userName
      userEmail
    }
  }
`;
