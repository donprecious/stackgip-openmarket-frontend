import {
  CreateProductOption,
  CreateProductResponse,
  CreateShipmentModel,
} from "./../../../../models/products.model";
import { environment } from "src/environments/environment";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { CreateProductModel } from "../../../../models/products.model";
import { nigeriaSates } from "src/app/data/nigeriastates";
import { ProductsService } from "../../../../services/products/products.service";

declare var cloudinary: any;
@Component({
  selector: "app-add-product",
  templateUrl: "./add-product.component.html",
  styleUrls: ["./add-product.component.css"],
})
export class AddProductComponent implements OnInit {
  

  errors: any[];
  errorMessage: string;

  form: FormGroup;
  cproduct: CreateProductResponse;

  shipment: CreateShipmentModel[] = [];
  productOptions: CreateProductOption[] = [];
  defaultOptions: string[];
  states: string[] = nigeriaSates.map((a) => a.name);
  constructor(private fb: FormBuilder, private productService: ProductsService) {}
  uploadWidget: any;

  get f() {
    return this.form.controls;
  }
  images = [];
  ngOnInit(): void {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      description: ["", [Validators.required]],
      price: [0.0, [Validators.required]],
      previousPrice: [0.0],
      category: ["", [Validators.required]],
      unit: [0, [Validators.required]],
    });
    this.defaultOptions = ["color", "size"];
    this.uploadWidget = cloudinary.createUploadWidget(
      {
        cloudName: environment.cloudinaryName,
        uploadPreset: environment.cloudinaryUploadPerset,
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          console.log("Done! Here is the image info: ", result.info);
          this.images.push(result.info.secure_url);
        }
      }
    );
    this.shipment.push({
      sn: 1,
      countryCode: "ng",
      state: "all",
      city: "all",
      cost: 0.0,
    });
    this.productOptions = [];

  }

  upload() {
    this.uploadWidget.open();
  }

  addShipment() {
    const sn = Math.round(Math.random() * 99999);

    const createShipment = {
      sn: sn,
      countryCode: "ng",
      state: "all",
      city: "all",
      cost: 0.0,
    } as CreateShipmentModel;
    this.shipment.push(createShipment);
  }

  removeShipment(sn) {
    this.shipment = this.shipment.filter((a) => a.sn !== sn);
  }

  addProductOption() {
    const sn = Math.round(Math.random() * 99999);

    const createOption = {
      sn,
      title: "",
      shortDescription: "",
      value: "",
      cost: 0.0,
    } as CreateProductOption;
    this.productOptions.push(createOption);
  }

  removeOption(sn) {
    this.productOptions = this.productOptions.filter((a) => a.sn !== sn);
  }

  onSubmit() {
    this.errors = [];
    this.errorMessage = "";

    const data: CreateProductModel  = {
      name: this.form.get("name").value,
      price: this.form.get("price").value,
      previousPrice: this.form.get("previousPrice").value,
      description: this.form.get("description").value,
      unit: this.form.get("unit").value,
      imageUrl: this.form.get("imageUrl").value,
      imageUrls: this.form.get("imageUrls").value,
      // profileImageUrl: "",
    } as CreateProductModel;

    const shipment: CreateShipmentModel = {
      // countryCode: this.form.get("countryCode").value,
      state: this.form.get("state").value,
      city: this.form.get("city").value,
      cost: this.form.get("cost").value,
    } as CreateShipmentModel;

    const productoption: CreateProductOption = {
      title: this.form.get("title").value,
      value: this.form.get("value").value,
      shortDescription: this.form.get("shortDescription").value,
    } as CreateProductOption;

    this.productService.createProduct(data).subscribe( cp => {
      this.cproduct.data;
      console.log(data);

      shipment => {
        this.shipment = shipment;
        console.log(shipment)
      }
      productoption => {
        this.productOptions = productoption;
      }
    })
  }
}
