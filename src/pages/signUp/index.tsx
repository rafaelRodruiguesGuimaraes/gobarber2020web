import React, { useCallback, useRef } from 'react';
import { FiMail, FiLock, FiUser, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import { Link, useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../util/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimatedContainer } from './styles';

const logo = require('../../assets/logo.svg');

const SignUp: React.FC = () => {
    const formRef = useRef<FormHandles>(null);
    const { addToast } = useToast();
    const history = useHistory();

    formRef.current?.setErrors({});

    const handleSubmit = useCallback(
        async (data: object) => {
            try {
                const schema = Yup.object().shape({
                    name: Yup.string().required('Name is required'),
                    email: Yup.string()
                        .required('E-mail is required')
                        .email('You must enter a valid email'),
                    password: Yup.string().min(
                        6,
                        'You must type at least 6 caracters'
                    ),
                });

                await schema.validate(data, {
                    abortEarly: false,
                });

                await api.post('/users', data);

                addToast({
                    type: 'success',
                    title: 'Sign-up success',
                    description: 'youre ready to use the app',
                });

                history.push('/');
            } catch (err) {
                if (err instanceof Yup.ValidationError) {
                    const errors = getValidationErrors(err);
                    formRef.current?.setErrors(errors);

                    return;
                }

                addToast({
                    title: 'error',
                    type: 'error',
                    description: 'Sigin error, check the data',
                });
            }
        },
        [addToast, history]
    );

    return (
        <Container>
            <Background />
            <Content>
                <AnimatedContainer>
                    <img src={logo} alt="logo" />

                    <Form ref={formRef} onSubmit={handleSubmit}>
                        <h1>Create an account</h1>

                        <Input icon={FiUser} name="name" placeholder="Name" />
                        <Input
                            icon={FiMail}
                            name="email"
                            placeholder="E-mail"
                        />
                        <Input
                            name="password"
                            type="password"
                            icon={FiLock}
                            placeholder="Password"
                        />

                        <Button type="submit"> Sign-up </Button>
                    </Form>

                    <Link to="/">
                        <FiArrowLeft />I already have an account
                    </Link>
                </AnimatedContainer>
            </Content>
        </Container>
    );
};

export default SignUp;
