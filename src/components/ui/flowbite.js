/**
 * Single import point for the Flowbite components this app uses.
 *
 * flowbite-react@0.7 does not declare `sideEffects: false`, so importing from its
 * package root defeats tree-shaking and drags the entire library into the bundle -
 * Datepicker, Carousel, react-markdown, react-icons and all. Importing the four
 * component folders we actually use keeps that out of the build.
 *
 * The trade-off is that these are deep paths into the package's build output, so
 * they are version-sensitive. Keeping them in one file means a flowbite-react
 * upgrade is a single edit rather than a repo-wide search.
 */
export { Badge } from "flowbite-react/lib/esm/components/Badge";
export { Button } from "flowbite-react/lib/esm/components/Button";
export { Flowbite } from "flowbite-react/lib/esm/components/Flowbite";
export { Label } from "flowbite-react/lib/esm/components/Label";
export { Modal } from "flowbite-react/lib/esm/components/Modal";
export { Select } from "flowbite-react/lib/esm/components/Select";
export { Spinner } from "flowbite-react/lib/esm/components/Spinner";
export { TextInput } from "flowbite-react/lib/esm/components/TextInput";
