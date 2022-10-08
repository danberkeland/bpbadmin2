import { API } from "aws-amplify";

import useSWR from "swr";
import useSWRImmutable from "swr/immutable";

import { emptyLocation } from "./formSchema";

const fetcher = async (path) => {
  console.log("fetching ", path)
  const res = await API.get("bpbrpc", path)
  console.log("done.")
  return (
    res
  )
}

export function useLocation(locNick) {
	const { data, error, mutate } = useSWRImmutable(locNick ? `/locations/getLocation?locNick=${locNick}` : null, fetcher)
    
    if (locNick) {
      
      // convert nulls to empty string
      const copiedData = {...data}
      const cleanedData = Object.fromEntries(Object.entries(copiedData).map(([k, v]) => [k, v === null ? "" : v]))

      return {
        location: {
          data: cleanedData,
          isLoading: !error && !data,
          isError: error,
          revalidate: () => mutate()
        }
      }
    } else {
      return {
        location: {
          data: emptyLocation,
          isLoading: false,
          isError: false
        }
      }
    }
}

export function useLocationList() {
	const { data, error, mutate } = useSWR('/locations/listLocations', fetcher, {
		revalidateIfStale: false,
		revalidateOnFocus: false,
		revalidateOnReconnect: true
	})

	return {
		locationList: {
      data: data,
		  isLoading: !error && !data,
		  isError: error,
      revalidate: () => mutate()
    }
	}
}

export function useLocationStore() {
  const { data, mutate } = useSWRImmutable(
    'locationPageKey',
    () => ({
      form_viewType: "HIDDEN",
      table_selected: null
    })
  )
  
  // cannot access properties of data without
  // copying first for some reason. Example:
  //    let foo = data works.
  //    let foo = data.form_viewType throws an error, but 
  //    let foo = copiedData.form_viewType works.
  const copiedData = {...data}

  return {
    form: {
      viewType: copiedData.form_viewType,
      setViewType: (vt) => {
        mutate({ ...data, form_viewType: vt}, {revalidate: false})
      }
    },

    table: {
      selected: copiedData.table_selected,
      setSelected: (value) => {
        data.table_selected = value
        mutate({ ...data, table_selected: value }, {revalidate: false})
      }
    },

    localData: data
  }

}


// ***** Testing local data management *****

// export function useTestStore() {

//   const { data, mutate } = useSWRImmutable(
//     'myStoreKey', 
//     () => ({
//       answers: { number: 42 }
//     })
//   )

//   return {
//     data: data,
//     addOne: () => {
//       let newData = { ...data, answers: { ...data.answers } }
//       newData.answers.number += 1
//       mutate({...newData}, {revalidate: false})
//     },
//     subtractOne: () => {
//       let newData = { ...data, answers: { ...data.answers } }
//       newData.answers.number -= 1
//       mutate({...newData}, {revalidate: false})
//     }
//   }
// }
