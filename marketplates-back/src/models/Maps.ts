import mongoose, { Schema } from 'mongoose';
import { IMaps, PrivacyStatus, UserPrivileges } from '../types.js';

const mapsSchema = new mongoose.Schema<IMaps>(
  {
    _id: {
      type: mongoose.SchemaTypes.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    creationDate: { type: Date, default: Date.now() },
    description: { type: String, required: true },
    name: { type: String, required: true },
    ownerId: { type: mongoose.SchemaTypes.ObjectId, required: true },
    participants: [{
      userId: { type: [mongoose.SchemaTypes.ObjectId], required: true },
      userPrivileges: { type: [String], enum: UserPrivileges, required: true }
    }],
    placeIterationIds: { type: [mongoose.SchemaTypes.ObjectId], required: true },
    privacyStatus: { type: String, enum: PrivacyStatus, default: PrivacyStatus.Private }
  },
  { versionKey: false }
)

/*


ENTRIES (Empêcher les scripts d'être insérés à l'intérieur des inputs)
Couche de protection pour string sur react déjà existante
Mais sanitize et vérification côté back
https://www.npmjs.com/package/sanitize-html

Pour permettre de passer des balises pures pour customiser ses posts, mais RIEN ne doit être
autorisé à part les balises elles mêmes


COOKIES (Empêcher la modification des cookies pour accéder à d'autres sessions)
Eviter de se le faire voler au premier abord

TOUS les cookie doivent HTTPOnly (ne peut pas être récupéré via JS)
Set-Cookie: <name>=<value>[; <Max-Age>=<age>] [; expires=<date>][; domain=<domain_name>] [; path=<some_path>][; secure][; HttpOnly]

Suspecious request handlers
Si une requète est faite par un utilisateur et qu'elle contient des balises
=> Ajout au suspecious requests
*/



const collectionName = 'Maps'
const MapsModel = mongoose.model('Maps', mapsSchema, collectionName)

export default MapsModel