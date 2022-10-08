import React from 'react'
import { API } from 'aws-amplify'

import useSWRImmutable from 'swr/immutable'
import { fetcher } from './fetcher'
import ItemFormFC from './ItemFormFC'
import { useSWRConfig } from 'swr'



export const CreateForm = ({form, table, itemSchema}) => {

  // yup's .cast() and .getDefault() methods seem not to be working.
  // the following is a workaround to obtain default values from the schema.
  const initialValues = Object.fromEntries(Object.entries(itemSchema.fields).map( ([k,v]) => {
    const copy_v = {...v}
    const copy_spec = {...copy_v.spec}
    if ("default" in copy_spec) {return [k, copy_spec.default]}
    return ([k, ""]) 
  }))

  const mKey1 = itemSchema.meta().listPath

  return (
    <ItemFormFC 
      form={form} 
      itemSchema={itemSchema} 
      initialValues={initialValues} 
      submitPath={itemSchema.meta().createPath}
      mutateSwrKeys={[mKey1]}
    />
  )

}

export const ViewForm = ({form, table, itemSchema}) => {
  const selectedId = table.selected[itemSchema.meta().idField]
  const swrKey = itemSchema.meta().getPath + '?' + itemSchema.meta().idField + '=' + selectedId
  const { data: initialValues, error } = useSWRImmutable(swrKey, fetcher)

  return (
    <ItemFormFC 
      form={form} 
      itemSchema={itemSchema} 
      initialValues={initialValues} 
      submitPath={null}
      mutateSwrKeys={null}
    />
  )
}

export const EditForm = ({form, table, itemSchema}) => {
  const selectedId = table.selected[itemSchema.meta().idField]
  const swrKey = itemSchema.meta().getPath + '?' + itemSchema.meta().idField + '=' + selectedId
  const { data: initialValues, error } = useSWRImmutable(swrKey, fetcher)

  const mKey1 = itemSchema.meta().listPath

  return (
    <ItemFormFC 
      form={form} 
      itemSchema={itemSchema} 
      initialValues={initialValues} 
      submitPath={itemSchema.meta().updatePath}
      mutateSwrKeys={[mKey1, swrKey]}
    />
  )

}