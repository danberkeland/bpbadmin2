import { API } from "aws-amplify";

import useSWRImmutable from "swr/immutable";

export const fetchQuery = async (path) => await API.get("bpbrpc", path)
export const fetchMutation = async (path, body) => await API.post("bpbrc", path, body)



export function useProductsPageStore() {
  const emptySelection = {prodNick: null, prodName: null}

  const { data, mutate } = useSWRImmutable(
    'ProductsPageKey',
    () => ({
      form_viewMode: "HIDDEN",
      table_selected: emptySelection
    })
  )
  
  const dataCopy = {...data}

  return {
    table: {
      selected: dataCopy.table_selected? dataCopy.table_selected : emptySelection,
      setSelected: (selection) => {mutate({...data, table_selected: selection}, {revalidate: false})} 
    },

    form: {
      viewMode: dataCopy.form_viewMode,
      setViewMode: (mode) => { mutate({...data, form_viewMode: mode}, {revalidate: false})}
    }
  }
}