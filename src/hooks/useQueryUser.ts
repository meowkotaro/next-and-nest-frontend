import { useRouter } from "next/router";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@prisma/client";

/**
 * ログインユーザーの情報を取得する
 */
export const useQueryUser = () => {
    const router = useRouter()

    const getUser = async () => {
        const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
            `${process.env.NEXT_PUBLIC_API_URL}/user`
        )
        return data
    }

    /**
     * react-queryのuseQueryを使って、取得するデータをキャッシュする
     */
    return useQuery<Omit<User, 'hashedPassword'>, Error>({
        queryKey: ['user'],
        queryFn: getUser,
        /**
         * onErrorは、useQueryでエラーが発生した時に呼ばれる
         */
        onError: (err: any) => {
            if (err.response.status === 401 || err.response.status === 403) {
                router.push('/')
            }
        }
    })
}