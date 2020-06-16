import { Saving } from '../services/saving.services';


const saving = new Saving({});

export const findSaving = (id) => saving.findGeneralMethod(id);

export const updateUserSavings = () => {

};
