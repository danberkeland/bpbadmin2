import axios from "axios";

import { API, Auth, graphqlOperation } from 'aws-amplify';
import { getUser } from "./graphql/queries";

const API_testingGrQL = "https://dltjjr5aja.execute-api.us-east-2.amazonaws.com/dev/testingGrQL"
const API_grabLocList = "https://lkho363aq2.execute-api.us-east-2.amazonaws.com/dev/grabloclist"
const API_bpbgListProducts = "https://z6ar051vni.execute-api.us-east-2.amazonaws.com/devtwo/products"
const API_testcors = "https://z6ar051vni.execute-api.us-east-2.amazonaws.com/devtwo/testcors"

export const testingGrQL = async (locNick, delivDate, dayOfWeek) => {
    let testOrder
    try {
        testOrder = await axios.post(
          API_testingGrQL,
          {
            locNick: locNick,
            delivDate: delivDate,
            dayOfWeek: dayOfWeek
          }
        );
        
      } catch(err) {
        console.log("Error grabbing testingGrQL", err);
      }
    console.log("testOrder",testOrder)
    return testOrder.data.body
  }

export const grabLocList = async () => {
  let locList
  try {
    locList = await axios.post(
        API_grabLocList,
        {}
      );
    } catch(err) {
      console.log("Error grabbing locList", err);
    }
  console.log("grabLocList Response:",locList.status)
  return locList.data.body
}
 
export const testProducts = async () => {
  console.log("Calling bpbapi/products...")
  // const userToken = await getUserToken()
  // const requestInfo = {
  //   headers: {Authorization : userToken}
  // }

  // const data = await API.get('bpbgopher', '/testcors', requestInfo);
  // console.log(data);

  const data = await API.get('bpbapi', '/products');
  console.log(data);

};

export const getUserToken = async () => {
  const user = await Auth.currentAuthenticatedUser();
  // const userAttributes = await Auth.userAttributes(user);
  
  console.log("user: ", user)
  // console.log("user.attributes: ", user.attributes)
  // console.log("userAttributes: ", userAttributes)
  // try {
  //   console.log(JSON.parse(userAttributes[0].Value))
  // } catch (err) {
  //   console.log("Couldn't parse custom attribute")
  // }
  
  const token = user.signInUserSession.idToken.jwtToken
  // console.log("token: ", { token });
  return token
}

export const getDDbUserInfo = async () => {
  const user = await Auth.currentAuthenticatedUser();
  const sub = user.attributes.sub

  let ddbUser = await API.graphql(graphqlOperation(getUser, { sub: sub }))
  console.log("ddbUser: ", ddbUser)

}