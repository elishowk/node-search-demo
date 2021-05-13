
/**
 * Base interface for Model JSON
 */
export interface IModel {
  modelId: string,
  pipeline_tag: string,
  private: boolean,
  key: string
}

/**
 * Extra metadata to index with the model
 */
export interface IModelMetadata {
  pipeline_tag?: string,
  private?: boolean,
  key?: string
}