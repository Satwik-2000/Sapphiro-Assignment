import React from 'react';
import { useForm } from 'react-hook-form';
import './UserProfileForm.css';

const UserProfileForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm();

  const watchEmail = watch('email');
  const watchPhone = watch('phone');

  React.useEffect(() => {
    if (!watchEmail && !watchPhone) {
      setError('root', {
        type: 'manual',
        message: 'Either email or phone is required'
      });
    } else {
      clearErrors('root');
    }
  }, [watchEmail, watchPhone, setError, clearErrors]);

  const onSubmit = (data) => {
    console.log('Form data:', data);
    alert('Form submitted successfully! Check console for data.');
  };

  return (
    <div className="profile-form-container">
      <h2>User Profile Form</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
        <div className="form-group">
          <label>
            Name *
          </label>
          <input
            {...register('name', {
              required: 'Name is required',
              minLength: {
                value: 3,
                message: 'Name must be at least 3 characters'
              }
            })}
            className={errors.name ? 'error' : ''}
            placeholder="Enter your name"
          />
          {errors.name && (
            <span className="error-message">
              {errors.name.message}
            </span>
          )}
        </div>

        <div className="form-group">
          <label>
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label>
            Phone
          </label>
          <input
            type="tel"
            {...register('phone')}
            placeholder="Enter your phone number"
          />
        </div>

        {errors.root && (
          <div className="error-message">
            {errors.root.message}
          </div>
        )}

        <button
          type="submit"
          className="submit-button"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default UserProfileForm;