import css from './SignInPage.module.scss';
import {SignInBlock} from "./sign-in-block";

export const SignInPage = () => {
    return (
        <div className={css.wrapper}>
            <SignInBlock />
        </div>
    )
};