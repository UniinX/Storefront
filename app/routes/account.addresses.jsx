import {useState} from 'react';
import {
  data,
  Form,
  useActionData,
  useNavigation,
  useOutletContext,
} from 'react-router';
import {
  UPDATE_ADDRESS_MUTATION,
  DELETE_ADDRESS_MUTATION,
  CREATE_ADDRESS_MUTATION,
} from '~/graphql/customer-account/CustomerAddressMutations';
import {AccountPageHeader} from '~/components/account/AccountUI.jsx';

/**
 * @type {Route.MetaFunction}
 */
export const meta = () => {
  return [{title: 'Addresses'}];
};

/**
 * @param {Route.LoaderArgs}
 */
export async function loader({context}) {
  await context.customerAccount.handleAuthStatus();
  return {};
}

/**
 * @param {Route.ActionArgs}
 */
export async function action({request, context}) {
  const {customerAccount} = context;

  try {
    const form = await request.formData();

    const addressId = form.has('addressId')
      ? String(form.get('addressId'))
      : null;
    if (!addressId) {
      throw new Error('You must provide an address id.');
    }

    const isLoggedIn = await customerAccount.isLoggedIn();
    if (!isLoggedIn) {
      return data(
        {error: {[addressId]: 'Unauthorized'}},
        {status: 401},
      );
    }

    const defaultAddress = form.has('defaultAddress')
      ? String(form.get('defaultAddress')) === 'on'
      : false;
    const address = {};
    const keys = [
      'address1',
      'address2',
      'city',
      'company',
      'territoryCode',
      'firstName',
      'lastName',
      'phoneNumber',
      'zoneCode',
      'zip',
    ];

    for (const key of keys) {
      const value = form.get(key);
      if (typeof value === 'string') {
        address[key] = value.trim();
      }
    }

    const requiredKeys = ['address1', 'city', 'territoryCode', 'firstName', 'lastName', 'zip'];
    if (requiredKeys.some((key) => !address[key])) {
      return data({error: {[addressId]: 'Complete all required address fields.'}}, {status: 400});
    }
    if (!/^[A-Za-z]{2}$/.test(address.territoryCode)) {
      return data({error: {[addressId]: 'Use a two-letter country code.'}}, {status: 400});
    }
    if (Object.values(address).some((value) => value.length > 255)) {
      return data({error: {[addressId]: 'Address fields must be 255 characters or fewer.'}}, {status: 400});
    }
    if (address.phoneNumber && !/^\+?[0-9 ()-]{7,20}$/.test(address.phoneNumber)) {
      return data({error: {[addressId]: 'Enter a valid phone number.'}}, {status: 400});
    }

    switch (request.method) {
      case 'POST': {
        try {
          const {data: mutationData, errors} = await customerAccount.mutate(
            CREATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (mutationData?.customerAddressCreate?.userErrors?.length) {
            throw new Error(mutationData?.customerAddressCreate?.userErrors[0].message);
          }

          if (!mutationData?.customerAddressCreate?.customerAddress) {
            throw new Error('Customer address create failed.');
          }

          return {
            error: null,
            createdAddress: mutationData?.customerAddressCreate?.customerAddress,
            defaultAddress,
            addressId,
          };
        } catch (error) {
          return data(
            {error: {[addressId]: error instanceof Error ? error.message : String(error)}},
            {status: 400},
          );
        }
      }

      case 'PUT': {
        try {
          const {data: mutationData, errors} = await customerAccount.mutate(
            UPDATE_ADDRESS_MUTATION,
            {
              variables: {
                address,
                addressId: decodeURIComponent(addressId),
                defaultAddress,
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (mutationData?.customerAddressUpdate?.userErrors?.length) {
            throw new Error(mutationData?.customerAddressUpdate?.userErrors[0].message);
          }

          if (!mutationData?.customerAddressUpdate?.customerAddress) {
            throw new Error('Customer address update failed.');
          }

          return {
            error: null,
            updatedAddress: address,
            defaultAddress,
            addressId,
          };
        } catch (error) {
          return data(
            {error: {[addressId]: error instanceof Error ? error.message : String(error)}},
            {status: 400},
          );
        }
      }

      case 'DELETE': {
        try {
          const {data: mutationData, errors} = await customerAccount.mutate(
            DELETE_ADDRESS_MUTATION,
            {
              variables: {
                addressId: decodeURIComponent(addressId),
                language: customerAccount.i18n.language,
              },
            },
          );

          if (errors?.length) {
            throw new Error(errors[0].message);
          }

          if (mutationData?.customerAddressDelete?.userErrors?.length) {
            throw new Error(mutationData?.customerAddressDelete?.userErrors[0].message);
          }

          if (!mutationData?.customerAddressDelete?.deletedAddressId) {
            throw new Error('Customer address delete failed.');
          }

          return {error: null, deletedAddress: addressId, addressId};
        } catch (error) {
          return data(
            {error: {[addressId]: error instanceof Error ? error.message : String(error)}},
            {status: 400},
          );
        }
      }

      default: {
        return data(
          {error: {[addressId]: 'Method not allowed'}},
          {status: 405},
        );
      }
    }
  } catch (error) {
    return data(
      {error: error instanceof Error ? error.message : String(error)},
      {status: 400},
    );
  }
}

export default function Addresses() {
  const {customer} = useOutletContext();
  const {defaultAddress, addresses} = customer;

  const [showCreate, setShowCreate] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);

  const actionData = useActionData();

  // Reset forms on successful actions
  const handleCreateSuccess = () => {
    setShowCreate(false);
  };

  const handleEditSuccess = () => {
    setEditingAddressId(null);
  };

  return (
    <div className="space-y-8">
      <AccountPageHeader
        eyebrow="Delivery details"
        title="Saved addresses"
        description="Keep your preferred delivery destinations ready for a smoother checkout."
        action={<button
          onClick={() => {
            setShowCreate(!showCreate);
            setEditingAddressId(null);
          }}
          className="inline-flex min-h-12 items-center justify-center rounded-full bg-black px-6 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-transform hover:-translate-y-0.5"
        >
          {showCreate ? 'Close editor' : 'Add address'}
        </button>}
      />

      {/* New Address Card Form */}
      {showCreate && (
        <div className="animate-fade-in rounded-[22px] border border-black/10 bg-[#faf9f6] p-6">
          <h4 className="font-marcellus text-xs uppercase tracking-wider text-black dark:text-white mb-6">
            Add Shipping Address
          </h4>
          <NewAddressForm onSuccess={handleCreateSuccess} />
        </div>
      )}

      {/* Addresses Grid */}
      {!addresses.nodes.length ? (
        <div className="py-12 border border-dashed border-black/10 dark:border-white/10 rounded-2xl text-center flex flex-col items-center">
          <span className="font-work text-xs text-black/40 dark:text-white/40 mb-4">
            No shipping addresses saved to this account.
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.nodes.map((address) => {
            const isDefault = defaultAddress?.id === address.id;
            const isEditing = editingAddressId === address.id;

            return (
              <div
                key={address.id}
                className="border border-black/5 dark:border-white/5 rounded-2xl p-6 bg-brand-surface-light dark:bg-brand-surface-dark flex flex-col justify-between gap-6 transition-all duration-200"
              >
                {!isEditing ? (
                  /* Display Mode */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="font-marcellus text-sm text-black dark:text-white font-medium">
                        {address.firstName} {address.lastName}
                      </span>
                      {isDefault && (
                        <span className="font-work text-[8px] tracking-wider uppercase font-semibold px-2 py-0.5 rounded bg-brand-accent/10 text-brand-accent dark:bg-brand-accent-light/10 dark:text-brand-accent-light">
                          Default
                        </span>
                      )}
                    </div>

                    <div className="font-work text-xs leading-relaxed text-black/75 dark:text-white/70 font-light flex flex-col">
                      {address.company && <span>{address.company}</span>}
                      <span>{address.address1}</span>
                      {address.address2 && <span>{address.address2}</span>}
                      <span>
                        {address.city}, {address.zoneCode} {address.zip}
                      </span>
                      <span>{address.territoryCode}</span>
                      {address.phoneNumber && <span className="mt-2 block">{address.phoneNumber}</span>}
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setEditingAddressId(address.id);
                          setShowCreate(false);
                        }}
                        className="font-work text-[10px] tracking-wider uppercase text-black/60 hover:text-black dark:text-white/60 dark:hover:text-white border-b border-black/10 dark:border-white/10 pb-0.5 transition-all cursor-pointer"
                      >
                        Edit
                      </button>
                      <Form
                        method="DELETE"
                        onSubmit={(e) => {
                          if (!confirm('Are you sure you want to delete this address?')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <input type="hidden" name="addressId" defaultValue={address.id} />
                        <button
                          type="submit"
                          className="font-work text-[10px] tracking-wider uppercase text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 border-b border-red-500/20 dark:border-red-400/20 pb-0.5 transition-all cursor-pointer"
                        >
                          Delete
                        </button>
                      </Form>
                    </div>
                  </div>
                ) : (
                  /* Edit Mode */
                  <div className="animate-fade-in w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-marcellus text-xs uppercase tracking-wider text-black dark:text-white">
                        Edit Address
                      </h4>
                      <button
                        onClick={() => setEditingAddressId(null)}
                        className="font-work text-[9px] tracking-wider uppercase text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                    <AddressForm
                      addressId={address.id}
                      address={address}
                      defaultAddress={defaultAddress}
                      onSuccess={handleEditSuccess}
                    >
                      {({stateForMethod}) => (
                        <div className="flex items-center gap-3 mt-4">
                          <button
                            disabled={stateForMethod('PUT') !== 'idle'}
                            formMethod="PUT"
                            type="submit"
                            className="px-5 py-2.5 rounded-full bg-black dark:bg-white text-white dark:text-black font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-90 cursor-pointer disabled:opacity-50"
                          >
                            {stateForMethod('PUT') !== 'idle' ? 'Saving...' : 'Save Changes'}
                          </button>
                        </div>
                      )}
                    </AddressForm>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function NewAddressForm({onSuccess}) {
  const newAddress = {
    address1: '',
    address2: '',
    city: '',
    company: '',
    territoryCode: '',
    firstName: '',
    id: 'new',
    lastName: '',
    phoneNumber: '',
    zoneCode: '',
    zip: '',
  };

  return (
    <AddressForm
      addressId={'NEW_ADDRESS_ID'}
      address={newAddress}
      defaultAddress={null}
      onSuccess={onSuccess}
    >
      {({stateForMethod}) => (
        <button
          disabled={stateForMethod('POST') !== 'idle'}
          formMethod="POST"
          type="submit"
          className="px-6 py-3 rounded-full bg-brand-accent dark:bg-brand-accent-light text-brand-bg-light dark:text-brand-bg-dark font-work text-[9px] tracking-wider uppercase font-semibold hover:opacity-95 cursor-pointer shadow-md disabled:opacity-50"
        >
          {stateForMethod('POST') !== 'idle' ? 'Creating...' : 'Add Address'}
        </button>
      )}
    </AddressForm>
  );
}

export function AddressForm({addressId, address, defaultAddress, children, onSuccess}) {
  const {state, formMethod} = useNavigation();
  const actionData = useActionData();
  const error = actionData?.error?.[addressId];
  const isDefaultAddress = defaultAddress?.id === addressId;

  // Trigger callback if success matches current address
  const actionSuccess = actionData && !actionData.error && actionData.addressId === addressId;
  if (actionSuccess && onSuccess) {
    setTimeout(onSuccess, 50);
  }

  return (
    <Form id={addressId} className="uniinx-account-form flex flex-col gap-4">
      <input type="hidden" name="addressId" defaultValue={addressId} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`firstName-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            First name*
          </label>
          <input
            id={`firstName-${addressId}`}
            name="firstName"
            type="text"
            required
            autoComplete="given-name"
            defaultValue={address?.firstName ?? ''}
            placeholder="First name"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* Last Name */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`lastName-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Last name*
          </label>
          <input
            id={`lastName-${addressId}`}
            name="lastName"
            type="text"
            required
            autoComplete="family-name"
            defaultValue={address?.lastName ?? ''}
            placeholder="Last name"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>
      </div>

      {/* Company */}
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor={`company-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
          Company
        </label>
        <input
          id={`company-${addressId}`}
          name="company"
          type="text"
          autoComplete="organization"
          defaultValue={address?.company ?? ''}
          placeholder="Company"
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
        />
      </div>

      {/* Address line 1 */}
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor={`address1-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
          Address line 1*
        </label>
        <input
          id={`address1-${addressId}`}
          name="address1"
          type="text"
          required
          autoComplete="address-line1"
          defaultValue={address?.address1 ?? ''}
          placeholder="Address line 1*"
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
        />
      </div>

      {/* Address line 2 */}
      <div className="flex flex-col gap-1 w-full">
        <label htmlFor={`address2-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
          Address line 2
        </label>
        <input
          id={`address2-${addressId}`}
          name="address2"
          type="text"
          autoComplete="address-line2"
          defaultValue={address?.address2 ?? ''}
          placeholder="Address line 2"
          className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* City */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`city-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            City*
          </label>
          <input
            id={`city-${addressId}`}
            name="city"
            type="text"
            required
            autoComplete="address-level2"
            defaultValue={address?.city ?? ''}
            placeholder="City"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* State/Province */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`zoneCode-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            State / Province*
          </label>
          <input
            id={`zoneCode-${addressId}`}
            name="zoneCode"
            type="text"
            required
            autoComplete="address-level1"
            defaultValue={address?.zoneCode ?? ''}
            placeholder="State / Province"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>

        {/* Zip/Postal */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`zip-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Zip / Postal*
          </label>
          <input
            id={`zip-${addressId}`}
            name="zip"
            type="text"
            required
            autoComplete="postal-code"
            defaultValue={address?.zip ?? ''}
            placeholder="Zip / Postal"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Code */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`territoryCode-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Country Code* (e.g. US)
          </label>
          <input
            id={`territoryCode-${addressId}`}
            name="territoryCode"
            type="text"
            required
            maxLength={2}
            autoComplete="country"
            defaultValue={address?.territoryCode ?? ''}
            placeholder="Country code (2 letter)"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all uppercase"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1 w-full">
          <label htmlFor={`phoneNumber-${addressId}`} className="font-work text-[9px] tracking-wider text-black/45 dark:text-white/30 uppercase">
            Phone Number
          </label>
          <input
            id={`phoneNumber-${addressId}`}
            name="phoneNumber"
            type="tel"
            pattern="^\+?[1-9]\d{3,14}$"
            autoComplete="tel"
            defaultValue={address?.phoneNumber ?? ''}
            placeholder="+16135551111"
            className="w-full px-4 py-2.5 rounded-lg border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-black dark:text-white text-xs font-work font-light focus:outline-none focus:border-brand-accent dark:focus:border-brand-accent-light transition-all"
          />
        </div>
      </div>

      {/* Set Default Address Checkbox */}
      <div className="flex items-center gap-2 py-2">
        <input
          id={`defaultAddress-${addressId}`}
          name="defaultAddress"
          type="checkbox"
          defaultChecked={isDefaultAddress}
          className="rounded border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-brand-accent focus:ring-brand-accent cursor-pointer"
        />
        <label htmlFor={`defaultAddress-${addressId}`} className="font-work text-xs text-black/60 dark:text-white/50 cursor-pointer">
          Set as default shipping address
        </label>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5 text-red-600 dark:text-red-400 font-work text-xs font-light">
          {error}
        </div>
      )}

      {children({
        stateForMethod: (method) => (formMethod === method ? state : 'idle'),
      })}
    </Form>
  );
}
