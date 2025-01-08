/**
 * Create a new document.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {Object} data - The data to create the document.
 * @returns {Promise<Object>} The created document.
 */
export const createDocument = async (model, data) => {
  try {
    const document = new model(data);
    return await document.save();
  } catch (error) {
    throw new Error(`Error creating document: ${error.message}`);
  }
};

/**
 * Retrieve documents based on a query with optional field selection.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {Object} query - The query to filter documents.
 * @param {Object} [options={}] - Additional query options (e.g., sort, limit).
 * @param {String} [select=null] - Fields to include or exclude (e.g., 'name email' or '-password').
 * @returns {Promise<Array>} The retrieved documents.
 */
export const getDocuments = async (
  model,
  query,
  options = {},
  select = null
) => {
  try {
    return await model.find(query, select, options);
  } catch (error) {
    throw new Error(`Error retrieving documents: ${error.message}`);
  }
};

/**
 * Retrieve a single document by ID with optional field selection.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {String} id - The ID of the document to retrieve.
 * @param {String} [select=null] - Fields to include or exclude (e.g., 'name email' or '-password').
 * @returns {Promise<Object>} The retrieved document.
 */
export const getDocumentById = async (model, id, select = null) => {
  try {
    return await model.findById(id).select(select);
  } catch (error) {
    throw new Error(`Error retrieving document by ID: ${error.message}`);
  }
};

/**
 * Update a document by ID.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {String} id - The ID of the document to update.
 * @param {Object} updates - The updates to apply to the document.
 * @returns {Promise<Object>} The updated document.
 */
export const updateDocumentById = async (model, id, updates) => {
  try {
    return await model.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
  } catch (error) {
    throw new Error(`Error updating document: ${error.message}`);
  }
};

/**
 * Delete a document by ID.
 * @param {mongoose.Model} model - The Mongoose model to use.
 * @param {String} id - The ID of the document to delete.
 * @returns {Promise<Object>} The deleted document.
 */
export const deleteDocumentById = async (model, id) => {
  try {
    return await model.findByIdAndDelete(id);
  } catch (error) {
    throw new Error(`Error deleting document: ${error.message}`);
  }
};
