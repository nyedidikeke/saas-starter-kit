import { InputWithLabel } from '@/components/ui';
import { getAxiosError } from '@/lib/common';
import axios from 'axios';
import { useFormik } from 'formik';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Button } from 'react-daisyui';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { ApiResponse } from 'types';
import * as Yup from 'yup';

export const ResetPasswordForm = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { t } = useTranslation('common');
  const { token } = router.query as { token: string };

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object().shape({
      password: Yup.string().required().min(8),
      confirmPassword: Yup.string().oneOf(
        [Yup.ref('password'), null],
        'Passwords must match'
      ),
    }),
    onSubmit: async (values) => {
      setSubmitting(true);

      try {
        await axios.post<ApiResponse>('/api/auth/reset-password', {
          ...values,
          token,
        });

        setSubmitting(false);
        formik.resetForm();
        toast.success(t('password-updated'));
        router.push('/auth/login');
      } catch (error: any) {
        toast.error(getAxiosError(error));
      }
    },
  });

  return (
    <div className="rounded-md bg-white p-6 shadow-sm">
      <form onSubmit={formik.handleSubmit}>
        <div className="space-y-2">
          <InputWithLabel
            type="password"
            label="New Password"
            name="password"
            placeholder="New Password"
            value={formik.values.password}
            error={formik.touched.password ? formik.errors.password : undefined}
            onChange={formik.handleChange}
          />
          <InputWithLabel
            type="password"
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formik.values.confirmPassword}
            error={
              formik.touched.confirmPassword
                ? formik.errors.confirmPassword
                : undefined
            }
            onChange={formik.handleChange}
          />
        </div>
        <div className="mt-4">
          <Button
            type="submit"
            color="primary"
            loading={submitting}
            active={formik.dirty}
            fullWidth
          >
            Reset Password
          </Button>
        </div>
      </form>
    </div>
  );
};
