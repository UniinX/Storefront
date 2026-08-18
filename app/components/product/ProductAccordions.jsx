/**
 * @file Below-the-fold PDP accordions. "Details" is backed by the product's
 * real descriptionHtml and always renders when present. Materials/Care/
 * Sustainability are backed by optional Shopify metafields (custom.material,
 * custom.care_instructions, custom.sustainability) and only render when the
 * merchant has actually filled in that metafield — no placeholder copy.
 */
import {Accordion, AccordionItem} from './Accordion.jsx';

export function ProductAccordions({product}) {
  return (
    <Accordion>
      {product.descriptionHtml && (
        <AccordionItem title="Details">
          <div dangerouslySetInnerHTML={{__html: product.descriptionHtml}} />
        </AccordionItem>
      )}
      <AccordionItem title="Materials & Form">
        {product.material?.value || null}
      </AccordionItem>
      <AccordionItem title="Care Instructions">
        {product.careInstructions?.value || null}
      </AccordionItem>
      <AccordionItem title="Sustainability">
        {product.sustainability?.value || null}
      </AccordionItem>
    </Accordion>
  );
}
