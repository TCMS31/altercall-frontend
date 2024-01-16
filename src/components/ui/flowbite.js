/**
 * Single import point for the Flowbite components this app uses.
 *
 * flowbite-react@0.7 does not declare `sideEffects: false`, so importing from its
 * package root defeats tree-shaking and drags the entire library into the bundle -
 * Datepicker, Carousel, react-markdown, react-icons and all. Importing the four
 * component folders we actually use keeps that out of the build.
 *
 * Public component exports keep the production bundle focused on these controls.
 * Jest 27 resolves the same components through their CommonJS counterparts via
 * the package's moduleNameMapper, since it does not resolve wildcard exports.
 */
export { Badge } from "flowbite-react/components/Badge";
export { Button } from "flowbite-react/components/Button";
export { Flowbite } from "flowbite-react/components/Flowbite";
export { Label } from "flowbite-react/components/Label";
export { Modal } from "flowbite-react/components/Modal";
export { Select } from "flowbite-react/components/Select";
export { Spinner } from "flowbite-react/components/Spinner";
export { TextInput } from "flowbite-react/components/TextInput";
