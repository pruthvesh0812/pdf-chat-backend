import { Pinecone } from '@pinecone-database/pinecone';

let isIndexCreated: boolean = false

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!
});



const createPineConeIndex = async () =>{
  try{
    await pc.createIndex({
      name: process.env.PINECONE_INDEX_NAME!,
      dimension: 1536,
      metric: 'cosine',
      spec: { 
        serverless: { 
          cloud: 'aws', 
          region: 'us-east-1' 
        }
      } 
    }); 
    console.log("index created")
  }
  catch(err){
    throw new Error("Index Creation Failed")
  }
 
}

export const getPineconeClient = async ():Promise<Pinecone> => {
  return new Promise(async (resolve,reject) =>{
    try{
      const currentIndexes = await pc.listIndexes()
 
      currentIndexes.indexes?.forEach(indexModal =>{
        if(indexModal.name == process.env.PINECONE_INDEX_NAME! ){
          isIndexCreated = true;
        }
      })
    
      if(!isIndexCreated){
        await createPineConeIndex()

      }

      resolve(pc)
    }
    catch(err){
      reject(err)
    }
    
  })
  

}