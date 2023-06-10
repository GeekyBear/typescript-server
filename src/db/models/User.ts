import { DataTypes, Model, Optional } from 'sequelize';
import connection from '../../config/dbConnect';
import Role from './Role';

interface UserAttributes {
    id?: number,
    name?: string | null,
    password?: string | null,
    email?: string | null,
    roleId: number | null,
    accessToken?: string | null,
    active?: boolean | null,
    verified?: boolean | null,

    createdAt?: Date,
    updatedAt?: Date
}

export interface UserInput extends Optional<UserAttributes, 'id'> { }
export interface UserOutput extends Required<UserAttributes> { }

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: number;
    public name!: string;
    public email!: string;
    public roleId!: number;
    public password!: string;
    public accessToken!: string;
    public verified!: boolean;
    public active!: boolean;
}

User.init({
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    roleId: {
        type: DataTypes.BIGINT,
        allowNull: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    accessToken: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    verified: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    },
    active: {
        type: DataTypes.BOOLEAN,
        allowNull: true
    }
}, {
    timestamps: true,
    sequelize: connection,
    underscored: false
});

User.belongsTo(Role, { foreignKey: "roleId" });

export default User;