# stockio: a mock stock app
A mock stock web app built without boilerplate code!

## Table of Contents:
### 1. [Demo](https://github.com/chanalisa/stockio#1-demo-1)
### 2. [Tech Stack](https://github.com/chanalisa/stockio#2-tech-stack-1)
  - Frontend
  - Backend
  - Amazon Web Services (AWS)
### 3. [Objectives](https://github.com/chanalisa/stockio#3-objectives-1)
  - Design & Style Guide
  - User Stories

## 1. Demo
http://stockio.alisa.codes/

## 2. Tech Stack
### Frontend:
- [Webpack](https://webpack.js.org/) (module bundler)
- [Sass](https://sass-lang.com/) (preprocessor)
- [React](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://github.com/axios/axios)
### Backend:
- [Express](http://expressjs.com/)
- [PostgreSQL](https://www.postgresql.org/)
### Amazon Web Services (AWS):
- [Relational Database Service (RDS)](https://aws.amazon.com/rds/)
- [Elastic Compute Cloud (EC2)](https://aws.amazon.com/ec2/)

## 3. Objectives
### Design & Style Guide:
![Image of Design & Style Guide for Stockio](https://github.com/chanalisa/stockio/blob/master/public/design-style-guide.png)

### User Stories:
1. Users can create a new account with first name, last name, email, and password.
- Each user's cash account balance has a default value of $5000.00 USD.
- A user can only register once with any given email.
2. Users authenticate via email and password to access their account.
3. Users can buy shares of stock at its current price by specifying the ticker symbol and the number of shares to invest.
- A user can only buy whole number quantities of shares.
- A user can only buy shares if they have enough cash in their account for a given purchase.
- A user can only buy shares if the ticker symbol is valid.
4. Users can view a list of all transactions they've made to date.
5. Users can view their portfolio (a list of all the stocks they own along with their current values).
- Current values should be based on the latest price and quantity owned for a given stock.
- Each stock owned should only appear once.
6. Users can see the font color of stock symbols and current prices in their portfolio change dynamically to indicating performance.
- Display red when the current price is less than the day’s open price.
- Display grey when the current price is equal to the day’s open price.
- Display green when the current price is greater than the day’s open price.
