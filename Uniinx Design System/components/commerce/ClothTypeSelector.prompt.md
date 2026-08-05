ClothTypeSelector bundles the two "customize" axes: garment STYLE (Tshirt/Hoodie/Kurta) and CLOTH/fabric (Cotton/Khadi/Linen/Silk, with a color swatch). Use together on the PDP/customizer.

```jsx
<ClothTypeSelector garmentId={garmentId} onGarmentChange={setGarmentId}
  fabricId={fabricId} onFabricChange={setFabricId} />
```

Notable exports: `GARMENTS`, `FABRICS` datasets. Both rows are independent 44px-min radiogroups with an indigo selected state (matches LanguageChipSelector).
