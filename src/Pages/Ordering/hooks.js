// SWR hooks for Ordering page

import { API } from "aws-amplify"
import useSWR from "swr"


const fetcher = (path) => await API.get('bpbrpc', path)

const locationList = () => {
  const { data } = useSWR('/locations/listLocations', fetcher)

  

}