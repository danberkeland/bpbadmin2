import { API } from "aws-amplify"

export const fetcher = async (path) => await API.get("bpbrpc", path)