import model from '../../sequelize/models';
import {GetUsers} from '../../services/user.service';

    const userResolver = {
        Query: {
            users: async () => {
                try{
                    return GetUsers.getAllUsers();
                }catch(err){
                    throw err.message;
                }
            }
        }
    }

    export default userResolver;