# Propuesta de Diseño: Neon Aurora

Esta propuesta busca elevar la estética de la aplicación "Control Gastos" hacia un estilo visual más premium, moderno y vibrante, manteniendo la usabilidad del modo oscuro.

## Concepto Visual
Un estilo **"Cyber-Fintech"** sofisticado que utiliza fondos profundos, efectos de cristal refinados y acentos de luz neón para guiar la atención del usuario.

## 1. Paleta de Colores

### Fondos (Backgrounds)
- **Actual**: Gris oscuro / Azulado estándar.
- **Nuevo**: `Slate 950` (#020617) o `Deep Navy`. Un tono casi negro que hace que los colores resalten más.

### Acentos (Accents)
Gradientes vibrantes que evocan auroras boreales:
- **Primario**: Gradiente de **Violeta** (#7c3aed) a **Fucsia** (#db2777).
- **Secundario**: **Cian** (#06b6d4) para elementos de información y gráficos.
- **Éxito/Error**: Versiones más saturadas y brillantes de verde y rojo, con sutiles resplandores (glows).

## 2. Componentes UI

### Glassmorphism 2.0 (Tarjetas)
- **Fondo**: Más transparente pero con mayor desenfoque (`backdrop-blur-xl`).
- **Bordes**: Bordes sutiles con gradientes o blanco translúcido (`border-white/10`) para un look "cortado a láser".
- **Sombras**: Sombras de color suaves detrás de las tarjetas activas para dar profundidad ("Glow effects").

### Botones
- **Primarios**: Gradientes horizontales con sombra de color difusa (`box-shadow`) que aumenta al hacer hover.
- **Secundarios**: Fondo transparente con borde sutil y efecto de brillo al pasar el mouse.

### Tipografía
- Mantener la fuente **Outfit** (es excelente).
- Aumentar el espaciado entre letras (`tracking-tight` en títulos, `tracking-wide` en etiquetas pequeñas).
- Usar pesos `Light` o `Medium` en lugar de `Bold` excesivo para una apariencia más limpia.

## 3. Ejemplo de Cambios (CSS Variables)

```css
:root {
  /* Fondo Profundo */
  --background: #020617; 
  
  /* Gradientes Neon */
  --primary: #8b5cf6; /* Violeta */
  --secondary: #06b6d4; /* Cian */
  --accent: #f43f5e; /* Rosa */
  
  /* Glass */
  --card-bg: rgba(15, 23, 42, 0.6);
  --glass-border: rgba(255, 255, 255, 0.08);
}
```

## Beneficios
1.  **Mayor Contraste**: Mejor legibilidad de datos clave.
2.  **Estética Premium**: Se siente como una app de alta gama.
3.  **Wow Factor**: Los gradientes y "glows" crean una experiencia inmersiva.
