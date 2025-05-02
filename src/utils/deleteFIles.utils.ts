import { cloudinary } from "../config/cloudinary.config"


export const deleteFiles = async (filesPath: string[]) => {

    filesPath.forEach(async(public_id) => {
        await cloudinary.uploader.destroy(public_id)
    })

}