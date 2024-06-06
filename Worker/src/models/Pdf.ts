import mongoose from 'mongoose'


const PDFSchema = new mongoose.Schema({
    pdfId:String,
    userId:String,
    namespace:String,
    pdfName:String
})

export const pdfs = mongoose.models.PDFS || mongoose.model("PDFS",PDFSchema)
