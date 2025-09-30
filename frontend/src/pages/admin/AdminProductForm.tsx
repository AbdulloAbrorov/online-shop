import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productsApi } from '../../api/products/products';
import type { Product } from '../../api/products/type';

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>>(
    {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      category: '',
    }
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit) return;
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const data = await productsApi.get(Number(id));
        if (mounted) setForm({
          name: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          category: data.category,
        });
        if (mounted) setPreview(data.imageUrl || '');
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'Failed to load product';
        setError(message);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id, isEdit]);
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (file) {
        const fd = new FormData();
        fd.append('name', form.name || '');
        fd.append('category', form.category || '');
        fd.append('description', form.description || '');
        fd.append('price', String(form.price ?? 0));
        fd.append('image', file);
        if (isEdit) {
          await productsApi.update(Number(id), fd);
        } else {
          await productsApi.create(fd);
        }
      } else {
        if (isEdit) {
          await productsApi.update(Number(id), form);
        } else {
          const payload = {
            name: form.name || '',
            description: form.description || '',
            price: form.price ?? 0,
            imageUrl: form.imageUrl || '',
            category: form.category || '',
          };
          await productsApi.create(payload);
        }
      }
      navigate('/admin/products');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save product';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold leading-[24px] text-primary">{isEdit ? 'Edit' : 'Add'} Product</h1>

      {error && <div className="mt-4 text-red-600">{error}</div>}

      <form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          className="border input rounded p-2"
          placeholder="Name"
          value={form.name || ''}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="border input rounded p-2"
          placeholder="Category"
          value={form.category || ''}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        />
       <label
       htmlFor='uploadImg'
       className='button rounded text-center pt-[6px]'
       >
        Upload Img
       <input
       id='uploadImg'
          type="file"
          accept="image/*"
          className='hidden'
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setFile(f);
            if (f) {
              const previewUrl = URL.createObjectURL(f);
              setPreview(previewUrl);
            } else {
              setPreview('');
            }
          }}
        />
       </label>
        <input
          className="border input rounded p-2"
          type="number"
          step="0.01"
          placeholder="Price"
          value={form.price ?? 0}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
        />
        <textarea
          className="border rounded p-2 md:col-span-2"
          placeholder="Description"
          rows={5}
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        {preview && (
          <div className="md:col-span-2">
            <img src={preview} alt="preview" className="w-32 h-32 object-cover rounded border" />
          </div>
        )}

        <div className="md:col-span-2 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className=" button px-4 py-2 rounded"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="border bg-red-600 text-main px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
