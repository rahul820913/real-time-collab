const  mongoose = require( "mongoose");

const projectSchema = new mongoose.Schema(
  {
    name: {
         type: String,
          required: true 
    },
    description: String,
    type: {
         type: String,
          enum: ["Web App", "API", "Library"],
           required: true 
        },
    visibility: { type: String, enum: ["Public", "Private"], default: "Public" },
    ownerId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User", 
         required: true
     },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    rootId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FileNode",
      required: false, // created automatically after project initialization
    },

  },
  { timestamps: true }
);

module.exports =  mongoose.model('Project', projectSchema);
